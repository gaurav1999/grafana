import { capitalize } from 'lodash';

import { PanelOptionsSupplier } from '@grafana/data/src/panel/PanelPlugin';
import { CanvasConnection, CanvasElementOptions, ConnectionDirection } from 'app/features/canvas';
import { ColorDimensionEditor, ResourceDimensionEditor, ScaleDimensionEditor } from 'app/features/dimensions/editors';
import { BackgroundSizeEditor } from 'app/features/dimensions/editors/BackgroundSizeEditor';

import { LineStyle } from '../types';

import { LineStyleEditor } from './LineStyleEditor';

interface OptionSuppliers {
  addBackground: PanelOptionsSupplier<CanvasElementOptions>;
  addBorder: PanelOptionsSupplier<CanvasElementOptions>;
  addColor: PanelOptionsSupplier<CanvasConnection>;
  addSize: PanelOptionsSupplier<CanvasConnection>;
  addDirection: PanelOptionsSupplier<CanvasConnection>;
  addLineStyle: PanelOptionsSupplier<CanvasConnection>;
}

const getCategoryName = (str: string, type: string | undefined) => {
  if (type !== 'frame' && type !== undefined) {
    return [str + ` (${type})`];
  }
  return [str];
};

export const optionBuilder: OptionSuppliers = {
  addBackground: (builder, context) => {
    const category = getCategoryName('Background', context.options?.type);
    builder
      .addCustomEditor({
        category,
        id: 'background.color',
        path: 'background.color',
        name: 'Color',
        editor: ColorDimensionEditor,
        settings: {},
        defaultValue: {
          // Configured values
          fixed: '',
        },
      })
      .addCustomEditor({
        category,
        id: 'background.image',
        path: 'background.image',
        name: 'Image',
        editor: ResourceDimensionEditor,
        settings: {
          resourceType: 'image',
        },
      })
      .addCustomEditor({
        category,
        id: 'background.size',
        path: 'background.size',
        name: 'Image size',
        editor: BackgroundSizeEditor,
        settings: {
          resourceType: 'image',
        },
      });
  },

  addBorder: (builder, context) => {
    const category = getCategoryName('Border', context.options?.type);
    builder.addSliderInput({
      category,
      path: 'border.width',
      name: 'Width',
      defaultValue: 2,
      settings: {
        min: 0,
        max: 20,
      },
    });

    if (context.options?.border?.width) {
      builder.addCustomEditor({
        category,
        id: 'border.color',
        path: 'border.color',
        name: 'Color',
        editor: ColorDimensionEditor,
        settings: {},
        defaultValue: {
          // Configured values
          fixed: '',
        },
      });
    }
  },

  addColor: (builder, context) => {
    const category = ['Color'];
    builder.addCustomEditor({
      category,
      id: 'color',
      path: 'color',
      name: 'Color',
      editor: ColorDimensionEditor,
      settings: {},
      defaultValue: {
        // Configured values
        fixed: '',
      },
    });
  },

  addSize: (builder, context) => {
    const category = ['Size'];
    builder.addCustomEditor({
      category,
      id: 'size',
      path: 'size',
      name: 'Size',
      editor: ScaleDimensionEditor,
      settings: {
        min: 1,
        max: 10,
      },
      defaultValue: {
        // Configured values
        fixed: 2,
        min: 1,
        max: 10,
      },
    });
  },

  addDirection: (builder, context) => {
    const category = ['Arrow Direction'];
    builder.addRadio({
      category,
      path: 'direction',
      name: 'Direction',
      settings: {
        options: [
          { value: undefined, label: capitalize(ConnectionDirection.Forward) },
          { value: ConnectionDirection.Reverse, label: capitalize(ConnectionDirection.Reverse) },
          { value: ConnectionDirection.Both, label: capitalize(ConnectionDirection.Both) },
          { value: ConnectionDirection.None, label: capitalize(ConnectionDirection.None) },
        ],
      },
      defaultValue: ConnectionDirection.Forward,
    });
  },

  addLineStyle: (builder, context) => {
    const category = ['Line style'];
    builder.addCustomEditor({
      category,
      id: 'lineStyle',
      path: 'lineStyle',
      name: 'Line style',
      editor: LineStyleEditor,
      settings: {},
      defaultValue: { value: LineStyle.Solid, label: 'Solid' },
    });
  },
};
