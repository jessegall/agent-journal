<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Unit;

use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use Domain\Questions\QuestionsDomain;
use Domain\Questions\Tests\TestCase;

/**
 * A domain's test boots core, that domain and only the domains it requires: Questions requires none, so it boots alone.
 */
final class QuestionsBootAloneTest extends TestCase
{
    public function test_only_the_questions_domain_is_booted(): void
    {
        $booted = array_map(
            fn (DomainEntry $entry) => $entry->domain::class,
            $this->app->make(DomainRegistry::class)->all(),
        );

        $this->assertSame([QuestionsDomain::class], array_values($booted));
    }
}
