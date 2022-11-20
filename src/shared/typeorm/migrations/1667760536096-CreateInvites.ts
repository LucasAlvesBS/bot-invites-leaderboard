import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInviters1667760536096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'inviters',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'guild_id',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'total_invitations',
            type: 'int',
          },
          {
            name: 'occasional_invitations',
            type: 'int',
          },
          {
            name: 'days_counter',
            type: 'int',
          },
          {
            name: 'invalid_account',
            type: 'boolean',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('inviters');
  }
}
