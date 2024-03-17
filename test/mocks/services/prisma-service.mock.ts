import { Prisma, PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { Subject, take } from 'rxjs';

export class PrismaServiceMock {
  private readonly prisma = new PrismaClient();
  private transaction: Prisma.TransactionClient | null = null;
  private isTransactionCommitted = new Subject<boolean>();

  public get resident(): Prisma.ResidentDelegate {
    return this.transaction!.resident;
  }

  public get industryChangeApplication(): Prisma.IndustryChangeApplicationDelegate {
    return this.transaction!.industryChangeApplication;
  }

  public async startTransaction(): Promise<void> {
    return await new Promise(async (resolve, reject) => {
      try {
        await this.prisma.$transaction(async (transaction) => {
          this.transaction = transaction;
          resolve();
          await this.waitForTransaction();
        });
      } catch (error) {
        reject(new Error(`Starting transaction failed: ${(error instanceof Error && error.stack) || error}.`));
      }
    });
  }

  private async waitForTransaction(): Promise<void> {
    return await new Promise((resolve, reject) =>
      this.isTransactionCommitted
        .pipe(take(1))
        .subscribe((isTransactionCommitted) => (isTransactionCommitted ? resolve() : reject())),
    );
  }

  public async rollbackTransaction(): Promise<void> {
    this.transaction = null;
    this.isTransactionCommitted.next(false);
  }

  public $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { maxWait?: number; timeout?: number },
  ): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
  public $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>,
    options?: { maxWait?: number; timeout?: number },
  ): runtime.Types.Utils.JsPromise<R>;
  public async $transaction(...args: any[]): Promise<any> {
    return Array.isArray(args[0]) ? await Promise.all(args[0]) : await args[0](this.transaction);
  }
}
