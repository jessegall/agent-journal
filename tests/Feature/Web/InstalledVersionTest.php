<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Web\Contracts\InstalledVersion;
use App\Web\Support\InstalledVersion as CachedVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Process;
use Tests\TestCase;

final class InstalledVersionTest extends TestCase
{
    public function test_a_checkout_shows_the_short_hash_of_its_head(): void
    {
        Process::fake(['*' => Process::result("0123456789abcdef0123456789abcdef01234567\n")]);

        $this->assertSame('012345678', $this->app->make(InstalledVersion::class)->label());
    }

    public function test_a_checkout_git_cannot_read_shows_unknown(): void
    {
        Process::fake(['*' => Process::result('', 'fatal: not a git repository', 128)]);

        $this->assertSame('unknown', $this->app->make(InstalledVersion::class)->label());
    }

    public function test_the_version_is_read_once_and_kept_until_the_cache_is_cleared(): void
    {
        $this->app->make(InstalledVersion::class)->label();
        Cache::put(CachedVersion::CACHE_KEY, 'kept');

        $this->assertSame('kept', $this->app->make(InstalledVersion::class)->label());
    }

    public function test_every_page_shares_the_version(): void
    {
        $shared = $this->app->make(HandleInertiaRequests::class)->share(Request::create('/'));

        $this->assertSame($this->app->make(InstalledVersion::class)->label(), $shared['version']);
    }
}
