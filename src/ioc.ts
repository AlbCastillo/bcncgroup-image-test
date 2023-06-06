import { IocContainer } from '@tsoa/runtime';
import { container } from 'tsyringe';

class MyIocContainer implements IocContainer {
  get<T>(controller: { prototype: T }): T {
    return container.resolve<T>(controller as never);
  }
}

export const iocContainer = new MyIocContainer();
