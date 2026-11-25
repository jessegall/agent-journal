<?php

declare(strict_types=1);

namespace App\Support\Sources;

use App\Exceptions\DockDefinitionInvalid;
use App\Support\Cards\DockIdentity;
use App\Support\Reflector;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;

/**
 * One dockable type as its owner registered it: its type key, the class of its sources, the provider that reads
 * them in batches, and the presentations it offers.
 */
final readonly class DockDefinition
{
    public const string DEFAULT_PRESENTATION = 'default';

    /**
     * @param  class-string<Dockable>  $class
     * @param  class-string<DockableProvider>  $provider
     * @param  list<string>  $presentations
     */
    public function __construct(
        public string $type,
        public string $class,
        public string $provider,
        public array $presentations = [self::DEFAULT_PRESENTATION],
    ) {}

    public function identity(string $id): DockIdentity
    {
        return new DockIdentity($this->type, $id);
    }

    /**
     * @throws DockDefinitionInvalid
     */
    public function assertOwns(Dockable $source): void
    {
        if (Reflector::of($this->class)->asInstance($source)->isEmpty()) {
            throw DockDefinitionInvalid::notOwned($this->type, $source::class);
        }
    }
}
