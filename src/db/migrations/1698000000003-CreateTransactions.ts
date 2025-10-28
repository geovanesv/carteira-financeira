import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class CreateTransactions1698000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'payer_wallet_id', type: 'int' },
          { name: 'payee_wallet_id', type: 'int' },
          { name: 'amount', type: 'decimal', precision: 10, scale: 2 },
          { name: 'status', type: 'varchar' }, // completed, reversed
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('transactions', [
      new TableForeignKey({
        columnNames: ['payer_wallet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'wallets',
        onDelete: 'NO ACTION',
      }),
      new TableForeignKey({
        columnNames: ['payee_wallet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'wallets',
        onDelete: 'NO ACTION',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('transactions');
    const foreignKeyPayer = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('payer_wallet_id') !== -1,
    );
    const foreignKeyPayee = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('payee_wallet_id') !== -1,
    );
    await queryRunner.dropForeignKey('transactions', foreignKeyPayer!);
    await queryRunner.dropForeignKey('transactions', foreignKeyPayee!);
    await queryRunner.dropTable('transactions');
  }
}
