<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\SupervisorRouteInvalid;
use JsonSerializable;

final readonly class SupervisorRoutes implements JsonSerializable
{
    /** @param list<SupervisorOverride> $overrides */
    public function __construct(
        public SupervisorTarget $default = new SupervisorTarget(),
        public array $overrides = [],
    ) {}

    /** @param array<string, mixed> $routes */
    public static function fromArray(array $routes): self
    {
        if (! isset($routes['default']) || ! is_string($routes['default'])) {
            throw SupervisorRouteInvalid::missingDefault();
        }

        $overrides = [];

        foreach (array_diff_key($routes, ['default' => true]) as $key => $target) {
            $type = AskTypeKey::from($key);

            if (! is_string($target)) {
                throw SupervisorRouteInvalid::target($key);
            }

            $overrides[] = new SupervisorOverride($type, SupervisorTarget::parse($target));
        }

        return new self(SupervisorTarget::parse($routes['default']), $overrides);
    }

    public function targetFor(AskTypeKey $type): SupervisorTarget
    {
        foreach ($this->overrides as $override) {
            if ($override->type->key === $type->key) {
                return $override->target;
            }
        }

        return $this->default;
    }

    public function withDefault(SupervisorTarget $target): self
    {
        return new self($target, $this->overrides);
    }

    public function withOverride(AskTypeKey $type, SupervisorTarget $target): self
    {
        $overrides = array_values(array_filter(
            $this->overrides,
            fn (SupervisorOverride $override): bool => $override->type->key !== $type->key,
        ));

        return new self($this->default, [...$overrides, new SupervisorOverride($type, $target)]);
    }

    /** @return array<string, string> */
    public function jsonSerialize(): array
    {
        $routes = ['default' => $this->default->key];

        foreach ($this->overrides as $override) {
            $routes[$override->type->key] = $override->target->key;
        }

        return $routes;
    }
}
