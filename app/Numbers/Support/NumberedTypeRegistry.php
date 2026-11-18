<?php

declare(strict_types=1);

namespace App\Numbers\Support;

use App\Numbers\Contracts\Numbered;
use App\Numbers\Exceptions\NumberedModelInvalid;
use App\Numbers\Exceptions\NumberedModelUndeclared;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Every numbered model the owners declare. Once every link type is registered, the declarations are checked, and a
 * model that is not numbered, has no link type, or shares one or a table with another stops the boot.
 */
final class NumberedTypeRegistry
{
    /**
     * @var list<NumberedModel>
     */
    private array $declared = [];

    /**
     * @var array<string, NumberedModel>
     */
    private array $declaredOfLinkType = [];

    public function register(NumberedModel ...$models): void
    {
        array_push($this->declared, ...$models);
    }

    public function checkDeclarations(): void
    {
        $tables = [];
        $this->declaredOfLinkType = [];

        foreach ($this->declared as $declared) {
            if (! is_subclass_of($declared->model, Numbered::class) || ! in_array(HasNumber::class, class_uses_recursive($declared->model), true)) {
                throw NumberedModelInvalid::notNumbered($declared->model);
            }

            $linkType = (string) Relation::getMorphAlias($declared->model);
            $table = (new $declared->model)->getTable();

            if ($linkType === $declared->model) {
                throw NumberedModelInvalid::withoutLinkType($declared->model);
            }

            if (isset($this->declaredOfLinkType[$linkType])) {
                throw NumberedModelInvalid::linkTypeTwice($linkType);
            }

            if (isset($tables[$table])) {
                throw NumberedModelInvalid::tableTwice($table);
            }

            $this->declaredOfLinkType[$linkType] = $declared;
            $tables[$table] = true;
        }
    }

    public function requireDeclared(string $linkType): void
    {
        if (! isset($this->declaredOfLinkType[$linkType])) {
            throw NumberedModelUndeclared::for($linkType);
        }
    }
}
