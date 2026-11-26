<?php

declare(strict_types=1);

namespace App\Profiles;

/**
 * One override of an inherited policy: classes to add and to remove, exact operations to grant, operation grants to
 * remove, and operations to deny. A list left out inherits; an empty list changes nothing.
 */
final readonly class PolicyOverride
{
    /**
     * @param  list<RootRule>  $allowPaths
     * @param  list<RootRule>  $removePaths
     * @param  list<OperationRule>  $allowOperations
     * @param  list<string>  $removeOperations
     * @param  list<string>  $denyOperations
     */
    public function __construct(
        public array $allowPaths,
        public array $removePaths,
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
        return $this->allowPaths !== [] || $this->removePaths !== [] || $this->allowOperations !== []
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

    /**
     * The classes with this override applied: its removed classes gone, its allowed ones added once.
     *
     * @param  list<RootRule>  $classes
     * @return list<RootRule>
     */
    public function appliedTo(array $classes): array
    {
        $kept = array_values(array_filter($classes, fn (RootRule $class) => ! array_any(
            $this->removePaths,
            fn (RootRule $removed) => $removed->isSameAs($class),
        )));

        $added = array_values(array_filter($this->allowPaths, fn (RootRule $class) => ! array_any(
            $kept,
            fn (RootRule $existing) => $existing->isSameAs($class),
        )));

        return [
            ...$kept,
            ...$added,
        ];
    }
}
