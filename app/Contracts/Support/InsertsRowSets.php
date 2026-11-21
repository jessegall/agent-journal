<?php

declare(strict_types=1);

namespace App\Contracts\Support;

/**
 * Writes a set of a model's new rows in one insert, for rows that raise no fact of their own: each row is built by
 * the model's own constructor first, so its id, casts and timestamps are the ones a save would write.
 */
trait InsertsRowSets
{
    /**
     * Inserts the unsaved rows in one statement.
     *
     * @param  list<static>  $rows
     */
    public static function createAll(array $rows): void
    {
        if ($rows === []) {
            return;
        }

        static::query()->insert(array_map(static function (self $row): array {
            $row->setUniqueIds();

            if ($row->usesTimestamps()) {
                $row->updateTimestamps();
            }

            return $row->getAttributes();
        }, $rows));
    }
}
