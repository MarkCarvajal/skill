import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// Registrar módulos y tema en shared/utils/echarts-setup.ts (una sola vez)
import '@shared/utils/echarts-setup';

@Component({
  selector: 'app-chart',
  template: `<div #host class="w-full" [style.height]="height()" role="img" [attr.aria-label]="ariaLabel()"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnDestroy {
  host = viewChild.required<ElementRef<HTMLDivElement>>('host');

  ariaLabel = input('Gráfico');
  height = input('320px');
  loading = input(false);
  option = input.required<EChartsOption>();

  private chart?: echarts.ECharts;
  private resizeObserver?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      this.chart = echarts.init(this.host().nativeElement, 'app-theme');
      this.resizeObserver = new ResizeObserver(() => this.chart?.resize());
      this.resizeObserver.observe(this.host().nativeElement);
      this.render();
    });

    effect(() => {
      this.option();
      this.loading();
      this.render();
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.chart?.dispose();
  }

  private render() {
    if (!this.chart) return;

    this.chart.setOption(this.option(), true);
    this.loading() ? this.chart.showLoading() : this.chart.hideLoading();
  }
}
