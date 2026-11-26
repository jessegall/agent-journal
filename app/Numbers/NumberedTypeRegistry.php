<?php

declare(strict_types=1);

namespace App\Numbers;

use App\Concerns\HasNumber;
use App\Numbers\Exceptions\NumberedModelInvalid;
use App\Numbers\Exceptions\NumberedModelUndeclared;
use App\Records\Contracts\Numbered;
use App\Support\Reflector;
use App\Support\Registry;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * The numbered models, found among the models with a link type: a model is numbered by implementing Numbered, and says
 * how by its numberHolder(). Once every link type is registered, a model without the HasNumber trait or sharing a table
 * with another stops the boot.
 */
final class NumberedTypeRegistry
{
    /**
     * @var Registry<class-string>
     */
    private Registry $modelOfLinkType;

    public function __construct()
    {
        $this->modelOfLinkType = Registry::replacing(NumberedModelUndeclared::for(...));
    }

    public function checkDeclarations(): void
    {
        $tables = Registry::once(NumberedModelInvalid::tableTwice(...), NumberedModelInvalid::tableTwice(...));
        $this->modelOfLinkType = Registry::replacing(NumberedModelUndeclared::for(...));

        foreach (Relation::morphMap() as $linkType => $model) {
            if (! Reflector::factory()->isSubclassOf($model, Numbered::class)) {
                continue;
            }

            if (! in_array(HasNumber::class, class_uses_recursive($model), true)) {
                throw NumberedModelInvalid::notNumbered($model);
            }

            $this->modelOfLinkType->put($linkType, $model);
            $tables->put(new $model()->getTable(), $model);
        }
    }

    public function assertNumbered(string $linkType): void
    {
        $this->modelOfLinkType->get($linkType);
    }
}
