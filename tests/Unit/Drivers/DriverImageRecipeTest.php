<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Setup\DriverImage;
use App\Agents\Drivers\Setup\DriverImageRecipe;
use App\Agents\Drivers\Setup\DriverImageRecipes;
use App\Exceptions\DriverImageRecipeInvalid;
use App\Models\Projects\DriverImageRecipeRecord;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A driver image recipe names its exact inputs: the same files in any order give the same digest, a changed file,
 * base or version another, a path no tar may carry is refused by name, and a kept recipe comes back from its own
 * bytes without the deploy's folder.
 */
final class DriverImageRecipeTest extends TestCase
{
    use RefreshHookDatabase;

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

        $this->assertSame([$codex->digest, '0.165.0'], [$again->digest, $codex->version]);
        $this->assertStringContainsString('Dockerfile', $codex->context);
    }

    public function test_a_kept_recipe_is_kept_once_and_rebuilt_from_its_own_bytes(): void
    {
        $files = ['Dockerfile' => "FROM scratch\n", 'a.bin' => "\0\xff\x01"];
        $recipe = DriverImageRecipe::of('d', $files, self::BASE, '1.0.0');

        $kept = DriverImageRecipeRecord::keep($recipe);
        $keptAgain = DriverImageRecipeRecord::keep($recipe);
        $inputs = DriverImageRecipeRecord::query()->findOrFail($kept->id)->inputs();

        $this->assertSame(
            [$kept->id, $recipe->digest, $recipe->context, self::BASE, '1.0.0'],
            [$keptAgain->id, $inputs->digest, $inputs->context, $inputs->base, $inputs->version],
        );
    }
}
