/**
 * Copyright (C) 2024 Michael Bachmann
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import { linearScale, Scale } from "@babymotte/scales";

function renderScale(
  valueScale: Scale,
  tickMarks: number[],
  width: number,
  height: number,
  vertical: boolean,
  className: string,
  style: React.CSSProperties | undefined,
  tickMarkLabels: Map<number, string> | undefined,
  labelStyle: React.CSSProperties | undefined
) {
  const uiMin = 0;
  const uiMax = vertical ? height : width;

  const uiScale = linearScale(uiMin, uiMax, vertical);

  const minX = 0;
  const maxX = width;
  const minY = 0;
  const maxY = height;

  const converter = uiConverter(valueScale, uiScale);

  if (vertical) {
    return renderYTicks(
      tickMarks,
      converter,
      minX,
      maxX,
      className,
      style,
      tickMarkLabels,
      labelStyle
    );
  } else {
    return renderXTicks(
      tickMarks,
      converter,
      minY,
      maxY,
      className,
      style,
      tickMarkLabels,
      labelStyle
    );
  }
}

function renderXTicks(
  ticks: number[],
  converter: UiConverter,
  min: number,
  max: number,
  className: string,
  style: React.CSSProperties | undefined,
  tickMarkLabels: Map<number, string> | undefined,
  labelStyle: React.CSSProperties | undefined
) {
  const tickMarks = [];
  for (const tick of ticks) {
    const x = Math.floor(converter.toUiCoordinate(tick)) + 0.5;
    const line = (
      <line
        key={tick}
        x1={x}
        y1={min}
        x2={x}
        y2={max}
        className={className}
        style={style}
      />
    );
    tickMarks.push(line);
    if (tickMarkLabels) {
      const labelText = tickMarkLabels.get(tick);
      if (labelText) {
        const label = (
          <text
            key={labelText}
            className={"tickmark-label"}
            style={labelStyle}
            x={x}
            y={min}
          >
            {labelText}
          </text>
        );
        tickMarks.push(label);
      }
    }
  }
  return tickMarks;
}

function renderYTicks(
  ticks: number[],
  converter: UiConverter,
  min: number,
  max: number,
  className: string,
  style: React.CSSProperties | undefined,
  tickMarkLabels: Map<number, string> | undefined,
  labelStyle: React.CSSProperties | undefined
) {
  const tickMarks = [];
  for (const tick of ticks) {
    const y = Math.floor(converter.toUiCoordinate(tick)) + 0.5;
    const line = (
      <line
        key={tick}
        x1={min}
        y1={y}
        x2={max}
        y2={y}
        className={className}
        style={style}
      />
    );
    tickMarks.push(line);
    if (tickMarkLabels) {
      const labelText = tickMarkLabels.get(tick);
      if (labelText) {
        const label = (
          <text
            key={labelText}
            className={"tickmark-label"}
            style={labelStyle}
            x={min}
            y={y}
          >
            {labelText}
          </text>
        );
        tickMarks.push(label);
      }
    }
  }
  return tickMarks;
}

export default function Scale2D({
  viewBox,
  scaleX,
  majorTickMarksX,
  minorTickMarksX,
  scaleY,
  majorTickMarksY,
  minorTickMarksY,
  majorTickMarkStyle,
  minorTickMarkStyle,
  tickMarkLabelsX,
  tickMarkLabelsY,
  tickLabelStyleX,
  tickLabelStyleY,
}: {
  viewBox?: [number, number, number, number];
  scaleX: Scale;
  majorTickMarksX?: number[];
  minorTickMarksX?: number[];
  scaleY: Scale;
  majorTickMarksY?: number[];
  minorTickMarksY?: number[];
  majorTickMarkStyle?: React.CSSProperties;
  minorTickMarkStyle?: React.CSSProperties;
  tickMarkLabelsX?: Map<number, string>;
  tickMarkLabelsY?: Map<number, string>;
  tickLabelStyleX?: React.CSSProperties;
  tickLabelStyleY?: React.CSSProperties;
}) {
  if (!viewBox) {
    return null;
  }

  const [containerWidth, containerHeight] = [viewBox[2], viewBox[3]];

  const minorVerticalTicks =
    scaleX && minorTickMarksX
      ? renderScale(
          scaleX,
          minorTickMarksX,
          containerWidth,
          containerHeight,
          false,
          "tickmark-minor",
          minorTickMarkStyle,
          tickMarkLabelsX,
          tickLabelStyleX
        )
      : [];
  const minorHorizontalTicks =
    scaleY && minorTickMarksY
      ? renderScale(
          scaleY,
          minorTickMarksY,
          containerWidth,
          containerHeight,
          true,
          "tickmark-minor",
          minorTickMarkStyle,
          tickMarkLabelsY,
          tickLabelStyleY
        )
      : [];
  const majorVerticalTicks =
    scaleX && majorTickMarksX
      ? renderScale(
          scaleX,
          majorTickMarksX,
          containerWidth,
          containerHeight,
          false,
          "tickmark-major",
          majorTickMarkStyle,
          tickMarkLabelsX,
          tickLabelStyleX
        )
      : [];
  const majorHorizontalTicks =
    scaleY && majorTickMarksY
      ? renderScale(
          scaleY,
          majorTickMarksY,
          containerWidth,
          containerHeight,
          true,
          "tickmark-major",
          majorTickMarkStyle,
          tickMarkLabelsY,
          tickLabelStyleY
        )
      : [];

  return (
    <>
      {minorVerticalTicks}
      {minorHorizontalTicks}
      {majorVerticalTicks}
      {majorHorizontalTicks}
    </>
  );
}

type UiConverter = {
  toUiCoordinate: (value: number) => number;
};

function uiConverter(valueScale: Scale, uiScale: Scale) {
  return {
    toUiCoordinate: (val: number) => valueScale.convertTo(uiScale, val),
  };
}
