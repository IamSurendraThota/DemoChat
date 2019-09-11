import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
})
export class SkeletonLoaderComponent implements OnInit {

  public skeltonList: string[] = ["1", "2", "3", "4", "5", "6", "7"];

  @Input() public IsConversations: boolean = true;

  constructor() { }

  ngOnInit() { }

}
