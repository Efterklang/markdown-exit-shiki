import type { ShikiTransformer } from "shiki/types";

export interface ShikiOptions {
  themes: Record<string, string>;
  exclude_languages?: string[];
  language_aliases?: Record<string, string>;
  transformers?: string[];
  style_to_class?: {
    enable?: boolean;
    class_prefix?: string;
    css_output_path?: string;
  };
  code_collapse?: {
    enable?: boolean;
    max_lines?: number;
    show_lines?: number;
  };
  toolbar_items?: {
    lang?: boolean;
    title?: boolean;
    wrapToggle?: boolean;
    copyButton?: boolean;
    shrinkButton?: boolean;
  };
  copy?: { success?: string; error?: string };
  custom_css?: string;
}

export type StyleToClassTransformer = ShikiTransformer & {
  getCSS?: () => string | Promise<string>;
};

export interface ParsedConfig {
  themes: Record<string, string>;
  excludes: string[];
  aliases: Record<string, string>;
  collapseConfig: {
    enable: boolean;
    maxLines: number;
    showLines: number;
  };
  toolbarItems: {
    lang: boolean;
    title: boolean;
    wrapToggle: boolean;
    copyButton: boolean;
  };
  styleToClass: {
    enable: boolean;
    cssGetter?: () => string | Promise<string>;
    css_output_path?: string;
  };
  transformers?: ShikiTransformer[];
}
