<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\CurrentActorSetter;
use App\Support\AgentClientSettings;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;

/**
 * Signed agent calls in a test: one call as a start, or a console command's calls sent through the application's
 * own HTTP kernel with that start's settings. Each call starts with no actor, as a new request does.
 */
trait SendsSignedCalls
{
    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(TestStart $start, string $path, array $body): TestResponse
    {
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->app->forgetScopedInstances();
        $content = json_encode((object) $body) ?: '{}';

        return $this->call(
            'POST',
            $path,
            server: $start->serverHeaders($content, 'call-'.bin2hex(random_bytes(4)), target: $path),
            content: $content,
        );
    }

    /**
     * Runs the agent's console commands as the start, signing with its pin; a token names another credential.
     */
    private function runCommandsAs(TestStart $start, string|null $token = null): void
    {
        $settings = new AgentClientSettings('http://journal.test', $token ?? $start->token, $start->pin());
        $this->app->instance(AgentClientSettings::class, $settings);
        Http::fake(function (Request $request) {
            $server = ['CONTENT_TYPE' => 'application/json'];

            foreach ($request->headers() as $name => $values) {
                $server['HTTP_'.strtoupper(str_replace('-', '_', $name))] = $values[0];
            }

            $this->app->make(CurrentActorSetter::class)->clear();
            $this->app->forgetScopedInstances();
            $response = $this->call(
                'POST',
                (string) parse_url($request->url(), PHP_URL_PATH),
                server: $server,
                content: $request->body(),
            );

            return Http::response((string) $response->getContent(), $response->getStatusCode());
        });
    }
}
