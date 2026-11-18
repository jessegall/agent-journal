<?php

declare(strict_types=1);

namespace App\Profiles\Support;

/**
 * One override of an inherited policy: classes to add and to remove, exact operations to grant, operation grants to
 * remove, and operations to deny. A list left out inherits; an empty list changes nothing.
 */
final readonly class PolicyOverride
{
    /**
     * @param  list<ClassRule>  $allowClasses
     * @param  list<ClassRule>  $removeClasses
     * @param  list<OperationRule>  $allowOperations
     * @param  list<string>  $removeOperations
     * @param  list<string>  $denyOperations
     */
    public function __construct(
        public array $allowClasses,
        public array $removeClasses,
        public array $allowOperations,
        public array $removeOperations,
        public array $denyOperations,
    ) {}

    public static function none(): self
    {
        return new self([], [], [], [], []);
    }

    public function changesAccess(): bool
    {
        return $this->allowClasses !== [] || $this->removeClasses !== [] || $this->allowOperations !== []
            || $this->removeOperations !== [] || $this->denyOperations !== [];
    }

    /**
     * Every operation name the override mentions.
     *
     * @return list<string>
     */
    public function operationNames(): array
    {
        return [
            ...array_map(fn (OperationRule $rule) => $rule->name, $this->allowOperations),
            ...$this->removeOperations,
            ...$this->denyOperations,
        ];
    }
}
