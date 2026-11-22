<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ActorCategoryScan;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ParsedFile;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 39 stays true: no code in app or a domain chooses behaviour by the kind of actor, calls a removed
 * identity-category helper, or names a removed role or actor attribute. It asks an ability instead. That every
 * command declares Authorize or a trusted entry is kept by CommandFolderTest.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app and the domains.')]
final class ActorCategoryRuleTest extends TestCase
{
    private const string HOW_TO_FIX = 'Ask whether the actor may do the thing (an ability), never what kind it is.';

    private const string ACTOR_TYPE_FINDING = 'chooses behaviour by an ActorType case';

    /**
     * Where an ActorType case stays allowed, each with why it chooses no behaviour; the list only shrinks.
     */
    private const array ALLOWED = [
        'app/Sharing/Models/ShareAudit.php' => 'maps the kind of actor to the label an audit line shows',
    ];

    public function test_no_code_chooses_behaviour_by_the_type_of_actor(): void
    {
        $root = dirname(__DIR__, 2);
        $findings = [];

        foreach ([...glob("{$root}/domain/*/src") ?: [], "{$root}/app"] as $folder) {
            foreach (DomainFiles::in([$folder]) as $path) {
                $relative = substr($path, strlen($root) + 1);

                if (array_key_exists($relative, self::ALLOWED)) {
                    continue;
                }

                array_push($findings, ...ActorCategoryScan::findingsIn(ParsedFile::fromPath($path)));
            }
        }

        $this->assertSame([], $findings, self::HOW_TO_FIX);
    }

    public function test_the_scan_finds_a_choice_on_the_agent_type(): void
    {
        $fixture = dirname(__DIR__).'/Fixtures/Architecture/ActorCategory/AgentOnlyGreeting.php';

        $findings = ActorCategoryScan::findingsIn(ParsedFile::fromPath($fixture));

        $this->assertCount(1, $findings);
        $this->assertStringContainsString(self::ACTOR_TYPE_FINDING, $findings[0]);
    }
}
