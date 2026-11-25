<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Contracts\Drivers\DriverCompatibilities;
use App\Enums\DriverEvidence;
use App\Enums\SignInMethod;
use App\Enums\TransportProfileType;
use App\Events\Sessions\AccountSettingsRequested;
use App\Models\Accounts\Account;
use App\Support\AccountStartRecipe;
use App\Support\AccountStartSettings;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A start on a token account opens the token's file for the driver on descriptor 3 and names that descriptor; an
 * OAuth or key account's start reads no file.
 */
final class AccountSecretStartTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(string $driver): DriverCompatibility
            {
                return DriverCompatibility::pinned($driver)->withEvidence(DriverEvidence::NativeShown, 'this test');
            }
        });
    }

    public function test_a_token_account_reads_its_token_on_descriptor_three(): void
    {
        $recipe = $this->recipeFor(SignInMethod::ProviderToken);

        $this->assertSame(['/journal/accounts/work/provider-token'], $recipe->readFiles);
        $variables = array_column($recipe->environment, 'settingText', 'name');
        $this->assertSame('3', $variables['CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR']);
        $this->assertStringNotContainsString('token', implode(' ', $recipe->startFlags));
    }

    public function test_an_oauth_or_key_account_reads_no_file(): void
    {
        $this->assertSame([], $this->recipeFor(SignInMethod::OAuth)->readFiles);
        $this->assertSame([], $this->recipeFor(SignInMethod::ApiKey)->readFiles);
    }

    private function recipeFor(SignInMethod $method): AccountStartRecipe
    {
        $folder = '/journal/accounts/work';
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Work '.$method->value), $folder);
        $account->forceFill(['method' => $method])->save();
        $settings = new AccountStartSettings();
        $event = new AccountSettingsRequested('claude-code', $account->recordIdentity(), $folder, $settings);

        $this->app->make(Dispatcher::class)->dispatch($event);

        return $settings->recipeFor('claude-code', TransportProfileType::cases()[0]);
    }
}
