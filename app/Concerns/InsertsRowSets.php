<?php

declare(strict_types=1);

namespace App\Concerns;

/**
 * Writes a set of a model's new rows in one insert, for rows that raise no fact of their own: each row is built by
 * the model's own constructor first, so its id, casts and timestamps are the ones a save would write.
 */
trait InsertsRowSets
{
    /**
     * Inserts the unsaved rows in one statement, and gives the ids it wrote, in the order of the rows.
     *
     * @param  list<static>  $rows
     * @return list<string>
     */
    protected static function insertRows(array $rows): array
    {
        if ($rows === []) {
            return [];
        }

        $attributes = [];
        $ids = [];

        foreach ($rows as $row) {
            $row->setUniqueIds();

            if ($row->usesTimestamps()) {
                $row->updateTimestamps();
            }

            $attributes[] = $row->getAttributes();
            $ids[] = (string) $row->getKey();
        }

        static::query()->insert($attributes);

        return $ids;
    }
}
