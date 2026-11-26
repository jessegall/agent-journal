<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SupervisorRouteInvalid;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

final class SupervisorRoutes extends Data
{
    /**
     * @param  list<SupervisorOverride>  $overrides
     */
    public function __construct(
        public readonly SupervisorTarget $default = new SupervisorTarget(),
        #[DataCollectionOf(SupervisorOverride::class)]
        public readonly array $overrides = [],
    ) {}

    /**
     * @param  array<string, mixed>  $routes
     */
    public static function parse(array $routes): self
    {
        if (! isset($routes['default']) || ! is_string($routes['default'])) {
            throw SupervisorRouteInvalid::missingDefault();
        }

        $overrides = [];

        foreach (array_diff_key($routes, ['default' => true]) as $key => $target) {
            $type = AskTypeKey::of($key);

            if (! is_string($target)) {
                throw SupervisorRouteInvalid::target($key);
            }

            $overrides[] = new SupervisorOverride($type, SupervisorTarget::parse($target));
        }

        return new self(SupervisorTarget::parse($routes['default']), $overrides);
    }

    /**
     * The default target and every override's target.
     *
     * @return list<SupervisorTarget>
     */
    public function targets(): array
    {
        return [
            $this->default,
            ...array_map(fn (SupervisorOverride $override) => $override->target, $this->overrides),
        ];
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
            fn (SupervisorOverride $override) => $override->type->key !== $type->key,
        ));

        return new self($this->default, [...$overrides, new SupervisorOverride($type, $target)]);
    }
}
