<?php

declare(strict_types=1);

namespace App\Numbers\Support;

use App\Numbers\Contracts\Numbered;
use App\Numbers\Contracts\NumberedModelRegistration;
use App\Numbers\Exceptions\NumberedModelInvalid;
use App\Numbers\Exceptions\NumberedModelUndeclared;
use App\Reflection\Support\Reflector;
use App\Registries\Support\Registry;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Every numbered model the owners declare. Once every link type is registered, the declarations are checked, and a
 * model that is not numbered, has no link type, or shares one or a table with another stops the boot.
 */
final class NumberedTypeRegistry implements NumberedModelRegistration
{
    /**
     * @var list<NumberedModel>
     */
    private array $declared = [];

    /**
     * @var Registry<NumberedModel>
     */
    private readonly Registry $declaredOfLinkType;

    public function __construct()
    {
        $this->declaredOfLinkType = Registry::once(
            NumberedModelUndeclared::for(...),
            NumberedModelInvalid::linkTypeTwice(...),
        );
    }

    public function register(NumberedModel ...$models): void
    {
        array_push($this->declared, ...$models);
    }

    public function checkDeclarations(): void
    {
        $tables = Registry::once(NumberedModelInvalid::tableTwice(...), NumberedModelInvalid::tableTwice(...));
        $this->declaredOfLinkType->clear();

        foreach ($this->declared as $declared) {
            $numbered = Reflector::factory()->isSubclassOf($declared->model, Numbered::class)
                && in_array(HasNumber::class, class_uses_recursive($declared->model), true);

            if (! $numbered) {
                throw NumberedModelInvalid::notNumbered($declared->model);
            }

            $linkType = (string) Relation::getMorphAlias($declared->model);
            $table = new $declared->model()->getTable();

            if ($linkType === $declared->model) {
                throw NumberedModelInvalid::withoutLinkType($declared->model);
            }

            $this->declaredOfLinkType->put($linkType, $declared);
            $tables->put($table, $declared->model);
        }
    }

    public function requireDeclared(string $linkType): void
    {
        $this->declaredOfLinkType->get($linkType);
    }
}
