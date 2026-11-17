<?php

declare(strict_types=1);

namespace App\Core\Links;

use App\Core\Links\Exceptions\LinkTypeRepeated;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * The stable names links store for linkable models, such as tasks.task, instead of their class names. Each owner
 * registers its own models; a name or a model registered twice for different partners is refused, the same pair again
 * is accepted. Links are written only with registered names.
 */
final class LinkTypes
{
    /**
     * @param  array<string, class-string<Model>>  $modelOfName
     */
    public function register(array $modelOfName): void
    {
        $known = Relation::morphMap();

        foreach ($modelOfName as $name => $model) {
            $registeredModel = $known[$name] ?? null;
            $registeredName = array_search($model, $known, true);

            if (($registeredModel !== null && $registeredModel !== $model) || ($registeredName !== false && $registeredName !== $name)) {
                throw LinkTypeRepeated::for($name, $model);
            }
        }

        Relation::requireMorphMap();
        Relation::morphMap($modelOfName);
    }
}
