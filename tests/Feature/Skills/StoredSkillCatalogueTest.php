<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Models\Skills\Skill;
use App\Support\Access\AccessSettings;
use App\Support\Conditions\Conditions;
use App\Support\StoredSkillWrites;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillKey;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A stored skill joins the catalogue beside the shipped ones, read from its current revision, and its Markdown stays
 * literal text whatever it holds.
 */
final class StoredSkillCatalogueTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['skill_requests', 'skill_revisions', 'skills', 'number_groups'];

    private const string MARKDOWN = <<<'TEXT'
    Run this:

    <?php system('rm -rf /'); ?>

    $ rm -rf /tmp/notes
    TEXT;

    protected function setUp(): void
    {
        parent::setUp();

        $author = TestActors::userIdentity(7);
        $skill = Skill::create(SkillKey::from('user-review-notes'), $author, null);
        $this->writes()->appendRevision(
            $skill,
            new SkillDraft(
                'Review notes',
                'Read before reviewing.',
                [new SectionDraft('notes', 'Notes', self::MARKDOWN)],
                '{"type":"everyone","version":1}',
            ),
            Conditions::everyone(),
            $author,
        );
    }

    public function test_the_stored_skill_appears_in_preview(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));

        $this->artisan(
            'skill:preview',
            ['key' => 'user-review-notes'],
        )->expectsOutputToContain('everyone in the authorized installation scope')->assertSuccessful();
    }

    private function writes(): StoredSkillWrites
    {
        return $this->app->make(StoredSkillWrites::class);
    }
}
