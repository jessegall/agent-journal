<?php

declare(strict_types=1);

namespace Tests\Unit\Files;

use App\Exceptions\FileMissing;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Navigation\Exceptions\FolderClosed;
use App\Navigation\Exceptions\LinkLeavesPlace;
use App\Values\FilePath;
use App\Values\FolderEntry;
use RuntimeException;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * Nothing of a private place leaks: a project listing never names an account file, a refusal in a private place
 * names its place and relative path only, and a path handed in from outside never reaches an account.
 */
final class PrivatePlacesAuditTest extends TestCase
{
    use UsesTemporaryPlaces;

    private string $project;

    private string $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
        $this->accounts = "{$this->project}/storage/app/private/accounts";
        mkdir("{$this->accounts}/a", 0o700, true);
        file_put_contents("{$this->accounts}/a/.credentials.json", '{"secret": true}');
        file_put_contents("{$this->project}/storage/app/kept.txt", 'x');
        config(['accounts.root' => $this->accounts]);
    }

    public function test_a_project_listing_never_names_an_account_file(): void
    {
        $paths = array_map(
            fn (FolderEntry $entry) => $entry->path->relative,
            $this->files()->list(FilePath::in(Place::Project, 'storage'), Depth::levels(6))->entries,
        );

        $this->assertContains('storage/app/kept.txt', $paths);
        $this->assertSame([], array_values(array_filter($paths, fn (string $path) => str_contains($path, 'private'))));
    }

    public function test_a_refusal_in_a_private_place_names_place_and_relative_path_only(): void
    {
        $outside = sys_get_temp_dir().'/audit-outside-'.bin2hex(random_bytes(6));
        file_put_contents($outside, 'target');
        symlink($outside, "{$this->accounts}/a/link.json");

        try {
            foreach ([
                [FileMissing::class, FilePath::in(Place::Accounts, 'a/none.json')],
                [LinkLeavesPlace::class, FilePath::in(Place::Accounts, 'a/link.json')],
            ] as [$refusal, $file]) {
                $failure = $this->failureOf(fn () => $this->files()->read($file));

                $this->assertInstanceOf($refusal, $failure);
                $this->assertStringContainsString($file->label(), $failure->getMessage());

                foreach ([$failure->getMessage(), $failure->getTraceAsString()] as $text) {
                    $this->assertStringNotContainsString($this->accounts, $text);
                    $this->assertStringNotContainsString($outside, $text);
                }
            }
        } finally {
            unlink($outside);
        }
    }

    public function test_a_path_handed_in_from_outside_never_reaches_an_account(): void
    {
        $this->expectExceptionObject(FolderClosed::privatePlace(Place::Accounts));

        $this->files()->filePathOf("{$this->project}/storage/app/private/accounts/a/.credentials.json");
    }

    private function failureOf(callable $work): RuntimeException
    {
        try {
            $work();
        } catch (RuntimeException $failure) {
            return $failure;
        }

        $this->fail('No refusal was thrown.');
    }

    private function files(): Files
    {
        return $this->app->make(Files::class);
    }
}
