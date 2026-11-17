<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Core\Agents\Support\AgentClientSettings;
use App\Core\Contracts\CurrentActorSetter;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;

/**
 * Signed agent calls in a test: one call as a launch, or a console command's calls sent through the application's
 * own HTTP kernel with that launch's settings. Each call starts with no actor, as a new request does.
 */
trait SendsSignedCalls
{
    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(TestLaunch $launch, string $path, array $body): TestResponse
    {
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->app->forgetScopedInstances();
        $content = json_encode((object) $body) ?: '{}';

        return $this->call('POST', $path, server: $launch->serverHeaders($content, 'call-'.bin2hex(random_bytes(4))), content: $content);
    }

    private function runCommandsAs(string $token): void
    {
        $this->app->instance(AgentClientSettings::class, new AgentClientSettings('http://journal.test', $token));
        Http::fake(function (Request $request) {
            $server = ['CONTENT_TYPE' => 'application/json'];

            foreach ($request->headers() as $name => $values) {
                $server['HTTP_'.strtoupper(str_replace('-', '_', $name))] = $values[0];
            }

            $this->app->make(CurrentActorSetter::class)->clear();
            $this->app->forgetScopedInstances();
            $response = $this->call('POST', (string) parse_url($request->url(), PHP_URL_PATH), server: $server, content: $request->body());

            return Http::response((string) $response->getContent(), $response->getStatusCode());
        });
    }
}
