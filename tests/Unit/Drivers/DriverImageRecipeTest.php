<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Setup\DriverImage;
use App\Agents\Drivers\Setup\DriverImageRecipe;
use App\Agents\Drivers\Setup\DriverImageRecipes;
use App\Exceptions\DriverImageRecipeInvalid;
use Tests\TestCase;

/**
 * A driver image recipe names its exact inputs: the same files in any order give the same digest, a changed file,
 * base or version another, and a path no tar may carry is refused by name.
 */
final class DriverImageRecipeTest extends TestCase
{
    private const string BASE = 'journal-candidate@sha256:aaaa';

    public function test_the_same_files_in_any_order_are_one_recipe_and_any_change_is_another(): void
    {
        $digest = fn (array $files, string $base = self::BASE, string $version = '1.0.0') => DriverImageRecipe::of(
            'd',
            $files,
            $base,
            $version,
        )->digest;
        $recipe = $digest(['b.txt' => 'two', 'a.txt' => 'one']);

        $this->assertSame(
            [true, false, false, false, false],
            [
                $digest(['a.txt' => 'one', 'b.txt' => 'two']) === $recipe,
                $digest(['a.txt' => 'one', 'b.txt' => 'twO']) === $recipe,
                $digest(['a.txt' => 'one', 'b.txt' => 'two'], 'other@sha256:bbbb') === $recipe,
                $digest(['a.txt' => 'one', 'b.txt' => 'two'], version: '1.0.1') === $recipe,
                $digest(['a.tx' => 'tone', 'b.txt' => 'two']) === $recipe,
            ],
        );
    }

    public function test_a_path_no_tar_entry_may_carry_is_refused_by_name(): void
    {
        $refused = [];

        foreach (['/etc/passwd', '../escape', 'deep/../../out', str_repeat('x', 101)] as $path) {
            try {
                DriverImageRecipe::of('d', [$path => 'x'], self::BASE, '1.0.0');
            } catch (DriverImageRecipeInvalid $invalid) {
                $refused[] = str_contains($invalid->getMessage(), "\"{$path}\"");
            }
        }

        $this->assertSame([true, true, true, true], $refused);
    }

    public function test_each_driver_folder_of_the_deploy_reads_into_a_recipe_at_its_pinned_version(): void
    {
        $recipes = $this->journal->service(DriverImageRecipes::class);

        $codex = $recipes->of(DriverImage::at('.docker/drivers/codex'), self::BASE);
        $again = $recipes->of(DriverImage::at('.docker/drivers/codex'), self::BASE);

        $this->assertSame([$codex->digest, '0.172.0'], [$again->digest, $codex->version]);
        $this->assertStringContainsString('Dockerfile', $codex->context);
    }
}
