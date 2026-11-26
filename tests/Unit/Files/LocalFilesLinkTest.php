<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Navigation\Exceptions\LinkLeavesPlace;
use App\Values\FilePath;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * A link's target is read inside its place and refused when it leads out, and a link re-pointed while one Files
 * instance lives on is followed to its new target at the next read (story 40).
 */
final class LocalFilesLinkTest extends TestCase
{
    use UsesTemporaryPlaces;

    private const string FIRST_GENERATION = "# generation-1\n";

    private const string SECOND_GENERATION = "# generation-2\n";

    private string $skills;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skills = $this->placeInTemporaryFolder(Place::HostSkills);

        foreach (['generation-1', 'generation-2'] as $generation) {
            mkdir("{$this->skills}/generations/{$generation}", 0o755, true);
            file_put_contents("{$this->skills}/generations/{$generation}/SKILL.md", "# {$generation}\n");
        }

        symlink("{$this->skills}/generations/generation-1", "{$this->skills}/active");
    }

    public function test_a_link_target_inside_the_place_is_its_file_path(): void
    {
        $this->assertEquals(
            FilePath::in(Place::HostSkills, 'generations/generation-1'),
            $this->files()->linkTarget(FilePath::in(Place::HostSkills, 'active')),
        );
    }

    public function test_a_link_target_outside_the_place_is_refused_without_naming_it(): void
    {
        $outside = sys_get_temp_dir().'/link-outside-'.bin2hex(random_bytes(6));
        mkdir($outside);
        symlink($outside, "{$this->skills}/out");

        try {
            $this->files()->linkTarget(FilePath::in(Place::HostSkills, 'out'));
            $this->fail('A link out of the place was followed.');
        } catch (LinkLeavesPlace $refusal) {
            $this->assertStringNotContainsString($outside, $refusal->getMessage());
        } finally {
            rmdir($outside);
        }
    }

    public function test_a_link_re_pointed_while_files_lives_on_is_followed_to_its_new_target(): void
    {
        $files = $this->files();
        $skill = FilePath::in(Place::HostSkills, 'active/SKILL.md');

        $this->assertSame(self::FIRST_GENERATION, $files->read($skill));

        symlink("{$this->skills}/generations/generation-2", "{$this->skills}/active.next");
        rename("{$this->skills}/active.next", "{$this->skills}/active");

        $this->assertSame(self::SECOND_GENERATION, $files->read($skill));
    }

    private function files(): Files
    {
        return $this->app->make(Files::class);
    }
}
