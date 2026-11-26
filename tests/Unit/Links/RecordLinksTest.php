<?php

declare(strict_types=1);

namespace Tests\Unit\Links;

use App\Contracts\Records\RecordResolver;
use App\Exceptions\InvalidRecordIdentity;
use App\Exceptions\UnknownLinkType;
use App\Models\Records\Link;
use App\Support\RecordIdentity;
use Domain\Documents\DocumentsDomain;
use Domain\Plans\PlansDomain;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * Core reads and links records of every domain through the providers their owners register, and never lets a
 * record the actor may not read show itself, not even as a missing link.
 */
final class RecordLinksTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class, PlansDomain::class, TasksDomain::class);
    }

    public function test_an_unknown_alias_and_a_class_name_are_refused_before_any_class_is_resolved(): void
    {
        try {
            $this->records()->card(new RecordIdentity('fake.thing', (string) Str::ulid()));
            $this->fail('An unknown alias was read.');
        } catch (UnknownLinkType) {
            $this->expectException(InvalidRecordIdentity::class);
        }

        new RecordIdentity('Domain\\Tasks\\Models\\Task', (string) Str::ulid());
    }

    private function records(): RecordResolver
    {
        return $this->app->make(RecordResolver::class);
    }
}
