<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Contracts\Config\Repository;
use Tests\Architecture\Support\ConfigKeyScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every configuration key the code names exists: each #[Config('...')] attribute and each config('...') read under
 * app and the domains names a key the loaded configuration holds, so a key moved or misspelt fails here, not at boot.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every PHP file of app and the domains.')]
final class ConfigKeysTest extends TestCase
{
    public function test_every_named_config_key_exists(): void
    {
        $config = $this->app->make(Repository::class);
        $folders = [base_path('app'), ...glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: []];
        $missing = [];

        foreach (ScanCache::findingsInFolders(new ConfigKeyScan(), $folders) as $path => $keys) {
            foreach ($keys as $key) {
                if (! $config->has($key)) {
                    $missing[] = substr($path, strlen(base_path()) + 1).": {$key}";
                }
            }
        }

        sort($missing);

        $this->assertSame([], $missing);
    }
}
