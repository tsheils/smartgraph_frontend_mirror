import {Injectable} from '@angular/core';

@Injectable()
export class MessageService {

  constructor() {
  }

  getMessage(term: any, type: string, properties?: any): Message {
    let msg: string;
    let params: {};
    switch (type) {
      case"targetSearch": {
        msg = 'MATCH (n:Target) WHERE n.name=~{qParam2} OR n.uniprot_id =~{qParam2} RETURN n.name, n.uniprot_id ORDER BY n.name LIMIT 100 UNION MATCH (n:Target) WHERE n.name=~{qParam} OR n.uniprot_id =~{qParam} RETURN n.name, n.uniprot_id ORDER BY n.name LIMIT 100';
        // msg = 'MATCH (n:Target) WHERE n.name=~{qParam2} RETURN n.name, n.uniprot_id ORDER BY n.name LIMIT 100';
        params = {qParam2: '(?i)' + term + '.*', qParam: '(?i).*' + term + '.*'};
        break;
      }
      case"patternSearch": {
        //msg = 'MATCH (n:Pattern) WHERE n.smiles=~{qParam} RETURN n.smiles, n.pid ORDER BY n.smiles LIMIT 50';
        msg = 'MATCH (n:Compound) WHERE n.hash=~{qParam} RETURN n.hash, n.pid ORDER BY n.hash LIMIT 50';
        params = {qParam: term + '.*'};
        break;
      }
      case"compoundSearch": {
        //msg = 'MATCH (n:Pattern) WHERE n.smiles=~{qParam} RETURN n.smiles, n.pid ORDER BY n.smiles LIMIT 50';
        msg = 'MATCH (n:Compound) WHERE n.hash=~{qParam} RETURN n.compound, n.lid ORDER BY n.compound LIMIT 50';
        params = {qParam: term + '.*'};
        break;
      }
      case "expand":{
        let start:string = 'MATCH (n:'+ properties.origin;
        switch (properties.target) {
          //todo: switch to parameterized  constraints for 'n'
          case "Target": {
            // msg = 'MATCH p=shortestPath((t)-[r*..1]->(q:Target)) WHERE t.uuid = {qParam} return p LIMIT 100';
            msg =start +'{uuid:{qParam}}) MATCH (n)-[r]-(b:Target) with {segments:[{start: startNode(r), relationship:r, end: endNode(r)}]} AS ret RETURN ret LIMIT 100';
            break;
          }
          case "Compound": {
            msg =start +'{uuid:{qParam}}) MATCH (n)-[r]-(b:Compound) with {segments:[{start: startNode(r), relationship:r, end: endNode(r)}]} AS ret RETURN ret LIMIT 100';
            break;
          }
          case "Pattern": {
            msg =start +'{uuid:{qParam}}) MATCH (n)-[r]-(b:Pattern) with {segments:[{start: startNode(r), relationship:r, end: endNode(r)}]} AS ret RETURN ret LIMIT 100';
            break;
          }
          case "All": {
            msg = 'MATCH (n) WHERE n.uuid = {qParam} MATCH (n)-[r]-(b) with {segments:[{start: startNode(r), relationship:r, end: endNode(r)}]} AS ret RETURN ret LIMIT 100';
            break;
          }
        }
        params = {qParam: term};
        break;
      }

      case "chembl":
      case "target": {
        msg = 'MATCH (n:Target) WHERE n.uniprot_id= {qParam} MATCH (n)-[r:REGULATES]-(b) RETURN n, r, b';
        params = {qParam: term};
        break;
      }

      case "endNodeSearch":
      case "startNodeSearch": {
        msg ='MATCH (n:Target) WHERE n.uniprot_id IN {qParam} RETURN n AS data UNION MATCH (c:Compound) WHERE c.nostereo_hash IN {qParam} RETURN c AS data';
        //  msg = 'MATCH (n:Target) WHERE n.uniprot_id IN {qParam} RETURN n UNION MATCH (n:Compound) WHERE n.hash IN {qParam} RETURN n';
        params = {qParam: term};
        break;
      }
      case "smiles": {
        msg = 'MATCH (n:Pattern) WHERE n.pid= {qParam} MATCH (n)-[r]-(b) RETURN n, r, b LIMIT 5';
        params = {qParam: term};
        break;
      }

      case "compound": {
        msg = 'MATCH (n:Compound) WHERE n.compound= {qParam} MATCH (n)-[r]-(b) RETURN n, r, b LIMIT 5';
        params = {qParam: term};
        break;
      }

      case "uuid": {
        msg = 'MATCH (n) WHERE n.uuid= {qParam} MATCH (n)-[r]-(b) RETURN n, r, b';
        params = {qParam: term};
        break;
      }

      case "path": {
        console.log(term);
        let levels = properties.distance;
        msg = 'MATCH p=shortestPath((t)-[r*..' + levels + ']->(q:Target)) WHERE t.uuid IN {start} AND q.uuid IN {end} AND q.uuid <> t.uuid return p';
               params = {start: term.start, end: term.end};
        break;
      }

      case "node": {
        msg = 'MATCH (n:Target) WHERE n.uniprot_id= {qParam} RETURN n';
        params = {qParam: term};
        break;
      }
      case "counts": {
        switch(properties){
          case "Target":{
            msg = 'MATCH (n:Target) WHERE n.uuid = {qParam}  MATCH (n)-[r]-(b) RETURN DISTINCT labels(b),COUNT(labels(b))';
            break;
          }
          case "Compound":{
            msg = 'MATCH (n:Compound) WHERE n.uuid = {qParam}  MATCH (n)-[r]-(b) RETURN DISTINCT labels(b),COUNT(labels(b))';
            break;
          }
          case "Pattern":{
            msg = 'MATCH (n:Pattern) WHERE n.uuid = {qParam}  MATCH (n)-[r]-(b) RETURN DISTINCT labels(b),COUNT(labels(b))';
            break;
          }
        }
        params = {qParam: term};
        break;
      }

    }
    let message: Message = {
      type: type,
      message: msg,
      params: params
    };
    return message;

  }

}

export interface Message {
  type: string;
  message: string;
  params: Object;
}

