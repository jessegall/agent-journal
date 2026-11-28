<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\FluentChains;
use Tests\Fixtures\FluentChains\SampleHost;
use Tests\Fixtures\FluentChains\SampleJournal;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A fluent chain keeps one subject: no public method of a fluent class in tests/Support or app hands back
 * another fluent class, unless it is a getter that ends the chain, and no verb names an inner subject.
 */
#[TimeLimit(seconds: 60, reason: 'It reflects every class of app and tests/Support.')]
final class FluentChainsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Open the inner subject in a closure that receives it (rule 115):';

    public function test_no_fluent_class_switches_its_chain_or_flattens_an_inner_subject(): void
    {
        $chains = FluentChains::inFolders([
            base_path('app') => 'App\\',
            base_path('tests/Support') => 'Tests\\Support\\',
        ]);

        $this->assertSame([], $chains->faults(), self::HOW_TO_FIX);
    }

    public function test_a_flattened_verb_and_a_switching_call_are_found_by_name(): void
    {
        $faults = new FluentChains([SampleHost::class, SampleJournal::class])->faults();

        $this->assertCount(2, $faults);
        $this->assertStringStartsWith('SampleJournal::releaseTurnsOnTestHost', $faults[0]);
        $this->assertStringStartsWith('SampleJournal::sampleHost', $faults[1]);
    }
}
