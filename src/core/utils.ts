export const components = (app: any, components: Array<any>) => {
    components.forEach(component => {
        app.component(component.name, component);
    });
};

export const directives = (app: any, directives: any) => {
    Object.keys(directives).forEach(key => {
        app.directive(key, directives[key]);
    });
};

export const mixin = (app: any, mixin: any) => {
    app.mixin(mixin);
};

export const plugins = (app: any, plugins: Array<any>) => {
    plugins.forEach(plugin => {
        app.use(plugin[plugin.name], plugin.options || {});
    });
};
