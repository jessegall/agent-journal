<?php

declare(strict_types=1);

namespace App\Attributes;

use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\JournalRouteType;
use Attribute;

/**
 * Marks a console command agents may run through the journal, and what running it does: it reads or writes the journal, and may also need classes beyond that, such as a route that writes local files
 * or reaches an outside system. A console command without it is unknown to the classifier.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class JournalRoute
{
    /**
     * @param  list<CommandClass>  $alsoNeeds
     */
    public function __construct(public JournalRouteType $type, public array $alsoNeeds = []) {}

    /**
     * The classes a call of the route needs: a journal operation, a read for a read route, and what it also needs.
     *
     * @return list<CommandClass>
     */
    public function classes(): array
    {
        return [
            ...$this->type->classes(),
            ...$this->alsoNeeds,
        ];
    }
}
