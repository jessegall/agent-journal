<?php

declare(strict_types=1);

namespace App\Core\Links\Support;

use Illuminate\Database\ConnectionInterface;

/**
 * Turns class names stored in links into link names, for the owner's own migration: every link keeps its id, and a
 * converted row is dropped only when the very same link already exists under the new names. Running it again changes
 * nothing.
 */
final class LinkTypeRenames
{
    /**
     * @param  array<string, string>  $nameOfClass  the former class name of each model and its link name
     */
    public static function rename(ConnectionInterface $database, array $nameOfClass): void
    {
        $database->transaction(function () use ($database, $nameOfClass): void {
            $affected = $database->table('links')->whereIn('source_type', array_keys($nameOfClass))->orWhereIn('target_type', array_keys($nameOfClass))->orderBy('id')->get();

            foreach ($affected as $link) {
                $source = $nameOfClass[$link->source_type] ?? $link->source_type;
                $target = $nameOfClass[$link->target_type] ?? $link->target_type;
                $twin = $database->table('links')->where('id', '!=', $link->id)
                    ->where(['source_type' => $source, 'source_id' => $link->source_id, 'target_type' => $target, 'target_id' => $link->target_id])
                    ->exists();

                if ($twin) {
                    $database->table('links')->where('id', $link->id)->delete();

                    continue;
                }

                $database->table('links')->where('id', $link->id)->update(['source_type' => $source, 'target_type' => $target]);
            }
        });
    }
}
