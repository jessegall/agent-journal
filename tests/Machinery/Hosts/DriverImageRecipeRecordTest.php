<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Agents\Drivers\Setup\DriverImageRecipe;
use App\Models\Projects\DriverImageRecipeRecord;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A driver image recipe is kept once by its digest, and the kept row gives the recipe back from its own bytes,
 * without the deploy's folder.
 */
#[TestsMachinery(DriverImageRecipeRecord::class)]
final class DriverImageRecipeRecordTest extends TestCase
{
    use RefreshHookDatabase;

    private const string BASE = 'journal-candidate@sha256:aaaa';

    public function test_a_kept_recipe_is_kept_once_and_rebuilt_from_its_own_bytes(): void
    {
        $files = ['Dockerfile' => "FROM scratch\n", 'a.bin' => "\0\xff\x01"];
        $recipe = DriverImageRecipe::of('d', $files, self::BASE, '1.0.0');

        $kept = DriverImageRecipeRecord::create($recipe);
        $keptAgain = DriverImageRecipeRecord::create($recipe);
        $inputs = DriverImageRecipeRecord::query()->findOrFail($kept->id)->recipe;

        $this->assertSame(
            [$kept->id, $recipe->digest, $recipe->context, self::BASE, '1.0.0'],
            [$keptAgain->id, $inputs->digest, $inputs->context, $inputs->base, $inputs->version],
        );
    }
}
