<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ModelSelectionType;
use App\Agents\Exceptions\ModelRequired;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The model a launch asked for: a named model, or its profile's default. It is never empty.
 */
final readonly class ModelSelection
{
    private const string DEFAULT_INPUT = 'default';

    /**
     * @param  Option<string>  $model  the named model; none for the profile default
     */
    private function __construct(
        public ModelSelectionType $type,
        public Option $model,
    ) {}

    /**
     * @throws ModelRequired
     */
    public static function named(string $model): self
    {
        if (trim($model) === '') {
            throw ModelRequired::forLaunch();
        }

        return new self(ModelSelectionType::Named, new Some($model));
    }

    public static function profileDefault(): self
    {
        return new self(ModelSelectionType::ProfileDefault, None::create());
    }

    /**
     * The selection a caller typed: the literal default asks for the profile default, nothing at all is refused.
     *
     * @throws ModelRequired
     */
    public static function fromInput(string|null $input): self
    {
        if ($input === null) {
            throw ModelRequired::forLaunch();
        }

        return $input === self::DEFAULT_INPUT ? self::profileDefault() : self::named($input);
    }
}
