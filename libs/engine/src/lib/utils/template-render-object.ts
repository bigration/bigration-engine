import * as Handlebars from 'handlebars';
import handlebarsHelpers from 'handlebars-helpers';

const handlebars = Handlebars.create();
handlebarsHelpers({ handlebars: handlebars });

handlebars.registerHelper('object', function (context) {
  return new handlebars.SafeString(JSON.stringify(context));
});

const compiledTemplates = new Map<string, Handlebars.TemplateDelegate>();

export const templateRenderObject = (
  inputParameterValues: Record<string, unknown>,
  template?: string
): string | undefined => {
  if (!template) {
    return undefined;
  }

  Object.keys(inputParameterValues).forEach((key) => {
    if (
      typeof inputParameterValues[key] === 'object' &&
      template.includes(`{{${key}}}`)
    ) {
      inputParameterValues[key] = JSON.stringify(inputParameterValues[key]);
    }
  });

  let compiledTemplate = compiledTemplates.get(template);
  if (!compiledTemplate) {
    compiledTemplate = handlebars.compile(template);
    compiledTemplates.set(template, compiledTemplate);
  }

  return compiledTemplate(inputParameterValues);
};
