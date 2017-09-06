import { Component, Input } from '@angular/core';
import { Node } from '../../../d3';

@Component({
  selector: '[nodeVisual]',
  template: `
    <svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
      <svg:circle
          class="node {{node.labels[0]}}"
          [ngClass]="{startNode: node.startNode, endNode: node.endNode}"
          cx="0"
          cy="0"
          [attr.r]="node.r">
      </svg:circle>
       <svg:text>{{node.properties.chembl_id}}</svg:text>
<!--
       <svg:text>{{node.id}}</svg:text>
-->
    </svg:g>
  `,
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  @Input('nodeVisual') node: Node;
}
