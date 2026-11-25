<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Support\Facades\File;

/**
 * Every image build keeps its slow steps in Docker's cache: a package install
 * carries a cache mount for its package manager, and no package install follows a copy of the whole checkout in its
 * stage, where any changed file would run it again.
 */
final class DockerfileCacheTest extends TestCase
{
    private const string PACKAGE_INSTALL = '~\b(?:apt-get install|npm ci|npm install|composer install'
        .'|go mod download|pip install)\b~';

    private const string WHOLE_CHECKOUT_COPY = '~^COPY\s+(?:--\S+\s+)*\.\/?\s+\S+~';

    public function test_no_image_build_breaks_the_cache_of_a_package_install(): void
    {
        $faults = [];

        foreach (File::glob(base_path('.docker/*/Dockerfile')) as $dockerfile) {
            array_push($faults, ...$this->faultsIn($dockerfile));
        }

        $this->assertSame([], $faults);
    }

    public function test_a_cache_breaking_build_is_caught(): void
    {
        $faults = $this->faultsIn(base_path('tests/Fixtures/Architecture/Dockerfiles/cache-breaking.Dockerfile'));

        $this->assertCount(3, $faults);
    }

    /**
     * @return list<string>
     */
    private function faultsIn(string $dockerfile): array
    {
        $faults = [];
        $copiedWhole = false;

        foreach ($this->instructions($dockerfile) as $line => $instruction) {
            $where = str_replace(base_path().'/', '', $dockerfile).':'.$line;
            $copiedWhole = ! str_starts_with($instruction, 'FROM ') && ($copiedWhole
                || preg_match(self::WHOLE_CHECKOUT_COPY, $instruction) === 1);

            if (! str_starts_with($instruction, 'RUN ') || preg_match(self::PACKAGE_INSTALL, $instruction) !== 1) {
                continue;
            }

            if (! str_contains($instruction, '--mount=type=cache')) {
                $faults[] = "{$where}: a package install without a cache mount";
            }

            if ($copiedWhole) {
                $faults[] = "{$where}: a package install after the whole checkout was copied";
            }
        }

        return $faults;
    }

    /**
     * Each instruction of a Dockerfile by the line it starts on, its continued lines joined.
     *
     * @return array<int, string>
     */
    private function instructions(string $dockerfile): array
    {
        $instructions = [];
        $start = 0;
        $current = '';

        foreach (explode("\n", File::get($dockerfile)) as $index => $text) {
            if ($current === '') {
                $start = $index + 1;
            }

            $current .= ' '.rtrim(rtrim($text), '\\');

            if (! str_ends_with(rtrim($text), '\\')) {
                $instructions[$start] = trim($current);
                $current = '';
            }
        }

        return array_filter(
            $instructions,
            fn (string $instruction) => $instruction !== '' && ! str_starts_with($instruction, '#'),
        );
    }
}
