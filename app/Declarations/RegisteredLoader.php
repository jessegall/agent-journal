<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\Loader;
use App\Web\Declarations\RegisteredPage;
use Spatie\LaravelData\Data;

/**
 * A checked loader of an installed owner: its full key, such as plans.rows, the browser prop its answer comes back
 * under, its reader with the input and answer Data it declares, and the page whose visibility guards it, if any.
 */
final readonly class RegisteredLoader
{
    /**
     * @param  class-string  $reader
     * @param  class-string<Data>  $inputClass
     * @param  class-string<Data>  $answerClass
     * @param  string|null  $guardKey  the full key of the page that guards it; null for a shell loader, which only the
     *                                 member gate guards
     */
    private function __construct(
        public DomainClient $owner,
        public string $key,
        public string $prop,
        public string $reader,
        public string $inputClass,
        public string $answerClass,
        public string|null $guardKey,
    ) {}

    public static function of(DomainClient $owner, Loader $loader, RegisteredPage|null $guard): self
    {
        $key = $owner->fullKey('loader', $loader->name);
        $types = $owner->typesOfLoader($key, $loader->reader);

        return new self(
            owner: $owner,
            key: $key,
            prop: 'load_'.str_replace(['.', '-'], '_', $key),
            reader: $loader->reader,
            inputClass: $types->input,
            answerClass: $types->answer,
            guardKey: $guard?->key,
        );
    }
}
