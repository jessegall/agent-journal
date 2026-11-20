<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Support\CanonicalRenderer;
use App\Skills\Support\MarkdownParts;
use App\Skills\Values\SkillOwner;
use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Skills\Guide\GuideSkill;
use Tests\TestCase;

/**
 * A skill renders to one canonical text: front matter once, its title, then its sections in order, with a heading
 * include taken exactly and nothing rendered when a source is wrong.
 */
final class CanonicalRendererTest extends TestCase
{
    private const string EXPECTED = <<<'MARKDOWN'
        ---
        name: journal-guide
        description: 'Read before you retry.'
        ---

        # Guide

        ## Purpose

        A guide to retrying.

        ## Retrying

        Run it again.

        ```markdown
        ## Retry
        Not a heading.
        ```

        MARKDOWN;

    public function test_a_text_section_and_a_heading_include_render_the_expected_bytes(): void
    {
        $rendered = $this->renderer()->render(new GuideSkill(), $this->owner(base_path('tests/Fixtures/Skills/Guide')));

        $this->assertSame(self::EXPECTED, $rendered->markdown);
        $this->assertSame('journal-guide', $rendered->key->key);
        $this->assertSame(hash('sha256', self::EXPECTED), $rendered->digest);
    }

    public function test_changing_the_included_section_changes_the_digest(): void
    {
        $root = sys_get_temp_dir().'/skills-'.bin2hex(random_bytes(6));
        File::copyDirectory(base_path('tests/Fixtures/Skills/Guide/resources'), $root.'/resources');

        try {
            $before = $this->renderer()->render(new GuideSkill(), $this->owner($root))->digest;
            File::put(
                $root.'/resources/skills/guide.md',
                str_replace('Run it again.', 'Run it once more.', File::get($root.'/resources/skills/guide.md')),
            );
            $after = $this->renderer()->render(new GuideSkill(), $this->owner($root))->digest;
            File::put(
                $root.'/resources/skills/guide.md',
                str_replace('Stop.', 'Stop now.', File::get($root.'/resources/skills/guide.md')),
            );
            $unrelated = $this->renderer()->render(new GuideSkill(), $this->owner($root))->digest;
        } finally {
            File::deleteDirectory($root);
        }

        $this->assertNotSame($before, $after);
        $this->assertSame($after, $unrelated);
    }

    public function test_a_missing_heading_names_the_file_and_selector(): void
    {
        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage('guide.md > Guide > Failure > Again');

        $this->renderer()->render(
            new GuideSkill('guide.md', ['Guide', 'Failure', 'Again']),
            $this->owner(base_path('tests/Fixtures/Skills/Guide')),
        );
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function filesOutsideTheFolder(): iterable
    {
        yield 'absolute' => ['/etc/hosts'];

        yield 'parent step' => ['../src/GuideSkill.php'];

        yield 'url' => ['https://example.com/guide.md'];
    }

    #[DataProvider('filesOutsideTheFolder')]
    public function test_a_part_outside_the_owner_folder_is_refused(string $file): void
    {
        $this->expectException(SkillSourceInvalid::class);

        $this->renderer()->render(
            new GuideSkill($file, ['Guide']),
            $this->owner(base_path('tests/Fixtures/Skills/Guide')),
        );
    }

    public function test_a_symlink_leaving_the_folder_is_refused(): void
    {
        $root = sys_get_temp_dir().'/skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($root.'/resources/skills', recursive: true);
        symlink(base_path('tests/Fixtures/Skills/Guide/resources/skills/guide.md'), $root.'/resources/skills/guide.md');

        try {
            $this->expectException(SkillSourceInvalid::class);
            $this->expectExceptionMessage('is not a relative path inside');

            $this->renderer()->render(new GuideSkill(), $this->owner($root));
        } finally {
            File::deleteDirectory($root);
        }
    }

    public function test_a_heading_path_found_twice_is_refused(): void
    {
        $root = sys_get_temp_dir().'/skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($root.'/resources/skills', recursive: true);
        File::put(
            $root.'/resources/skills/guide.md',
            <<<'TEXT'
            # Guide

            ## Failure

            ### Retry

            One.

            ### Retry

            Two.

            TEXT,
        );

        try {
            $this->expectException(SkillSourceInvalid::class);
            $this->expectExceptionMessage('more than once');

            $this->renderer()->render(new GuideSkill(), $this->owner($root));
        } finally {
            File::deleteDirectory($root);
        }
    }

    public function test_an_empty_description_renders_nothing(): void
    {
        $this->expectException(SkillDeclarationInvalid::class);

        $this->renderer()->render(
            new GuideSkill(description: ''),
            $this->owner(base_path('tests/Fixtures/Skills/Guide')),
        );
    }

    private function renderer(): CanonicalRenderer
    {
        return new CanonicalRenderer(new MarkdownParts());
    }

    private function owner(string $root): SkillOwner
    {
        return new SkillOwner('Guide', $root, [], true);
    }
}
