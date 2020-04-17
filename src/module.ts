import { DataSourcePlugin } from '@grafana/data';
import { HeroicDatasource } from './datasource';
import { HeroicQueryEditor } from './components/HeroicQueryEditor';
import { HeroicConfigEditor } from './configuration/HeroicConfigEditor';

export const plugin = new DataSourcePlugin(HeroicDatasource)
  .setQueryEditor(HeroicQueryEditor)
  .setConfigEditor(HeroicConfigEditor);