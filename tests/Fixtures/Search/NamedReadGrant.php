<?php

declare(strict_types=1);

namespace Tests\Fixtures\Search;

use App\Contracts\ReadGrant;
use App\Exceptions\ReadGrantRefused;
use App\Values\AllowedNames;
use App\Values\ReadRequest;

/**
 * An agent's grant that allows exactly the reads it is given by name.
 */
final readonly class NamedReadGrant implements ReadGrant
{
    /**
     * @param  list<string>  $allowedReads
     */
    public function __construct(private array $allowedReads) {}

    public function allows(ReadRequest $request): bool
    {
        return in_array($request->name, $this->allowedReads, true);
    }

    public function assertAllowed(ReadRequest $request): void
    {
        if (! $this->allows($request)) {
            throw ReadGrantRefused::because("{$request->name} is not granted");
        }
    }

    public function allowedTargets(string $name): AllowedNames
    {
        return in_array($name, $this->allowedReads, true) ? AllowedNames::all() : AllowedNames::only([]);
    }
}
