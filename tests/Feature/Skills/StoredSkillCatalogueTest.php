<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Skills\Conditions\Conditions;
use App\Skills\Models\Skill;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillKey;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Artisan;
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
        $skill->appendRevision(
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

    public function test_a_stored_skill_is_listed_as_stored_with_its_revision_beside_shipped_skills(): void
    {
        Artisan::call('skill:list', ['--json' => true]);
        $listed = array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), null, 'key');

        $this->assertSame('stored', $listed['user-review-notes']['source']);
        $this->assertSame(1, $listed['user-review-notes']['revision']);
        $this->assertSame('Stored', $listed['user-review-notes']['owner']);
        $this->assertSame('shipped', $listed['journal']['source']);
        $this->assertNull($listed['journal']['revision']);
    }

    public function test_php_and_shell_lines_stay_literal_text(): void
    {
        Artisan::call('skill:show', ['key' => 'user-review-notes']);

        $this->assertStringContainsString(<<<'TEXT'
        ## Notes


        TEXT.self::MARKDOWN."\n", Artisan::output());
    }

    public function test_the_stored_skill_appears_in_preview(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));

        $this->artisan(
            'skill:preview',
            ['key' => 'user-review-notes'],
        )->expectsOutputToContain('everyone in the authorized installation scope')->assertSuccessful();
    }
}
