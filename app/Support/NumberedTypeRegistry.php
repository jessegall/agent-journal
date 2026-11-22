<?php

declare(strict_types=1);

namespace App\Support;

use App\Concerns\HasNumber;
use App\Contracts\Numbered;
use App\Exceptions\NumberedModelInvalid;
use App\Exceptions\NumberedModelUndeclared;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * The numbered models of the application, found among the models that have a link type: a model says it is numbered
 * by implementing Numbered, and how by its numberHolder(), so no owner lists it. Once every link type is registered,
 * the models are checked: one that implements Numbered without the HasNumber trait, or shares a table with another,
 * stops the boot.
 */
final class NumberedTypeRegistry
{
    /**
     * @var array<string, class-string<Model>>
     */
    private array $modelOfLinkType = [];

    public function checkDeclarations(): void
    {
        $tables = Registry::once(NumberedModelInvalid::tableTwice(...), NumberedModelInvalid::tableTwice(...));
        $this->modelOfLinkType = [];

        foreach (Relation::morphMap() as $linkType => $model) {
            if (! Reflector::factory()->isSubclassOf($model, Numbered::class)) {
                continue;
            }

            if (! in_array(HasNumber::class, class_uses_recursive($model), true)) {
                throw NumberedModelInvalid::notNumbered($model);
            }

            $this->modelOfLinkType[$linkType] = $model;
            $tables->put(new $model()->getTable(), $model);
        }
    }

    public function assertNumbered(string $linkType): void
    {
        if (! isset($this->modelOfLinkType[$linkType])) {
            throw NumberedModelUndeclared::for($linkType);
        }
    }
}
