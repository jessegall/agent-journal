<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\RefuseMissingModels;
use App\Exceptions\RecordUnavailable;
use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Models\Memory;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A row a command's model cannot find is answered as the command's refusal: the record does not exist or is not
 * available to the actor, worded the same either way.
 */
#[TestsMiddleware(RefuseMissingModels::class)]
final class RefuseMissingModelsTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * Memory, whose commands find their rows the way this middleware answers: core's own commands throw none.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    public function test_a_missing_row_is_refused_as_unavailable_to_the_actor(): void
    {
        $this->journal->owner()->agent('Ada')->actAs('Ada');

        $this->assertThrows(
            fn () => $this->journal->run(new RemoveMemoryCommand('memory-1')),
            RecordUnavailable::class,
            RecordUnavailable::forModel(Memory::class, 'memory-1')->getMessage(),
        );
    }
}
