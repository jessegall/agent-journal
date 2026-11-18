<?php

declare(strict_types=1);

namespace App\Links\Support;

use App\Links\Models\Link;
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
        $database->transaction(function () use ($nameOfClass): void {
            $names = array_values(array_unique([...array_keys($nameOfClass), ...array_values($nameOfClass)]));
            $links = Link::query()->whereIn('source_type', $names)->orWhereIn('target_type', $names)->orderBy('id')->get();
            $idOfEndpoints = $links->mapWithKeys(fn (Link $link) => [$link->endpointKey() => $link->id])->all();

            foreach ($links as $link) {
                $source = $nameOfClass[$link->source_type] ?? $link->source_type;
                $target = $nameOfClass[$link->target_type] ?? $link->target_type;

                if ($source === $link->source_type && $target === $link->target_type) {
                    continue;
                }

                if (($idOfEndpoints[$link->endpointKey()] ?? null) === $link->id) {
                    unset($idOfEndpoints[$link->endpointKey()]);
                }

                $newEndpoints = $link->endpointKeyFor($source, $target);

                if (isset($idOfEndpoints[$newEndpoints])) {
                    $link->delete();

                    continue;
                }

                $link->renameTypes($source, $target);
                $idOfEndpoints[$newEndpoints] = $link->id;
            }
        });
    }
}
