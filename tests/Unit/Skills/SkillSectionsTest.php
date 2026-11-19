<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Support\MarkdownParts;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillSection;
use App\Skills\Values\SkillSections;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

/**
 * Sections are listed by hand or read from a file's headings, and resolve to the same list of sections either way.
 */
final class SkillSectionsTest extends TestCase
{
    public function test_listed_sections_resolve_as_given_in_order(): void
    {
        $first = SkillSection::text('first', 'First', 'One.');
        $second = SkillSection::text('second', 'Second', 'Two.');

        $resolved = SkillSections::listed($first, $second)->resolve(new MarkdownParts(), SkillOwner::stored(), 'Guide');

        $this->assertSame([$first, $second], $resolved);
    }

    public function test_sections_from_a_file_resolve_to_what_the_heading_reader_gives(): void
    {
        $root = sys_get_temp_dir().'/skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($root.'/resources/skills', recursive: true);
        File::put($root.'/resources/skills/guide.md', "# Guide\n\nPurpose.\n\n## Retrying\n\nAgain.\n");
        $owner = new SkillOwner('Guide', $root, [], true);

        try {
            $resolved = SkillSections::fromFile('guide.md')->resolve(new MarkdownParts(), $owner, 'Guide');
            $this->assertEquals(new MarkdownParts()->sectionsOf('guide.md', $owner, 'Guide'), $resolved);
            $this->assertSame(['purpose', 'retrying'], array_map(fn (SkillSection $section) => $section->key, $resolved));

            $this->expectException(SkillSourceInvalid::class);
            SkillSections::fromFile('guide.md')->resolve(new MarkdownParts(), $owner, 'Other');
        } finally {
            File::deleteDirectory($root);
        }
    }
}
