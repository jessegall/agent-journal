<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Support\Facades\File;
use Symfony\Component\Finder\SplFileInfo;

/**
 * No image holds an agent's instructions or skills, and only a driver's own image holds configuration, copied from its
 * own folder under .docker/drivers: every other image holds programs and packages only. Every Dockerfile and
 * build script under .docker is read, so a new one is judged without being listed.
 */
final class ImageInstructionsTest extends TestCase
{
    /**
     * The folder whose families each declare their driver image, the only place configuration may be copied from.
     */
    private const string DRIVER_FOLDERS = '.docker/drivers/';

    private const string INSTRUCTION_COPY = '~^\s*(?:COPY|ADD)\b.*'
        .'(?:SKILL\.md|CLAUDE\.md|AGENTS\.md|/skills\b|instructions)~mi';

    /**
     * A COPY or ADD of a configuration file: settings, JSON, TOML, YAML, INI or environment files. The package lists an
     * install reads (composer.json, package.json and their locks) are what the image's packages come from, not settings.
     */
    private const string CONFIGURATION_COPY = '~^\s*(?:COPY|ADD)\b(?!.*\b(?:composer|package(?:-lock)?)\.(?:json|lock)\b).*'
        .'(?:\.json|\.toml|\.ya?ml|\.ini|\.conf|\.env|settings)\b~mi';

    public function test_no_image_build_copies_an_agents_instructions_or_skills(): void
    {
        $this->assertSame([], $this->linesMatching(self::INSTRUCTION_COPY));
    }

    public function test_no_image_build_but_a_drivers_own_copies_a_configuration_file(): void
    {
        $outsideDriverFolders = array_values(array_filter(
            $this->linesMatching(self::CONFIGURATION_COPY),
            fn (string $found) => ! $this->isDriverFolderCopy($found),
        ));

        $this->assertSame([], $outsideDriverFolders);
    }

    public function test_a_driver_folder_may_copy_its_own_configuration_but_none_from_outside_it(): void
    {
        $codex = '.docker/drivers/codex/Dockerfile:9:';

        $this->assertSame(
            [true, false, false],
            [
                $this->isDriverFolderCopy($codex.'COPY --chmod=0444 hooks.json config.toml /etc/codex/'),
                $this->isDriverFolderCopy($codex.'COPY ../claude-code/settings.json /etc/codex/'),
                $this->isDriverFolderCopy('.docker/helper/Dockerfile:9:COPY config.toml /etc/codex/'),
            ],
        );
    }

    public function test_the_package_lists_an_install_reads_pass(): void
    {
        $this->assertSame(0, preg_match(self::CONFIGURATION_COPY, 'COPY package.json package-lock.json ./'));
    }

    public function test_a_copied_settings_file_is_caught(): void
    {
        $this->assertSame(1, preg_match(
            self::CONFIGURATION_COPY,
            'COPY resources/agents/claude-code-managed-settings.json /etc/claude-code/managed-settings.json',
        ));
    }

    /**
     * @return list<string>
     */
    private function linesMatching(string $pattern): array
    {
        $found = [];

        foreach ($this->buildFiles() as $file) {
            foreach (explode("\n", (string) file_get_contents(base_path($file))) as $index => $line) {
                if (preg_match($pattern, $line) === 1) {
                    $found[] = $file.':'.($index + 1).':'.trim($line);
                }
            }
        }

        return $found;
    }

    /**
     * Every Dockerfile and build script under .docker, as a path from the project.
     *
     * @return list<string>
     */
    private function buildFiles(): array
    {
        $files = array_filter(
            File::allFiles(base_path('.docker')),
            fn (SplFileInfo $file) => $file->getFilename() === 'Dockerfile' || $file->getExtension() === 'sh',
        );

        return array_values(array_map(fn (SplFileInfo $file) => '.docker/'.$file->getRelativePathname(), $files));
    }

    /**
     * Whether a found copy is a driver's Dockerfile copying from its own folder: no source escapes it or is named
     * from the root.
     */
    private function isDriverFolderCopy(string $found): bool
    {
        [$file, , $line] = explode(':', $found, 3);
        $isDriverDockerfile = str_starts_with($file, self::DRIVER_FOLDERS) && str_ends_with($file, '/Dockerfile');
        $sources = array_slice(array_filter(
            preg_split('/\s+/', $line) ?: [],
            fn (string $word) => ! str_starts_with($word, '--'),
        ), 1, -1);

        $isOutside = fn (string $source) => str_contains($source, '..') || str_starts_with($source, '/');

        return $isDriverDockerfile && array_filter($sources, $isOutside) === [];
    }

    public function test_a_copied_skill_is_caught(): void
    {
        $this->assertSame(1, preg_match(self::INSTRUCTION_COPY, 'COPY resources/skills/journal/SKILL.md /opt/skills/'));
    }
}
