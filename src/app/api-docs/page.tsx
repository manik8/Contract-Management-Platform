'use client'

import { useEffect, useState } from 'react'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null)

  useEffect(() => {
    fetch('/api-docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
  }, [])

  if (!spec) {
    return <div className="p-8">Loading API documentation...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">{spec.info.title}</h1>
          <p className="text-gray-600 mb-6">{spec.info.description}</p>
          <p className="text-sm text-gray-500 mb-8">Version: {spec.info.version}</p>

          <div className="space-y-8">
            {Object.entries(spec.paths).map(([path, methods]: [string, any]) => (
              <div key={path} className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {path}
                </h2>
                <div className="space-y-4">
                  {Object.entries(methods).map(([method, details]: [string, any]) => (
                    <div
                      key={method}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            method === 'get'
                              ? 'bg-blue-100 text-blue-800'
                              : method === 'post'
                              ? 'bg-green-100 text-green-800'
                              : method === 'patch'
                              ? 'bg-yellow-100 text-yellow-800'
                              : method === 'delete'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {method.toUpperCase()}
                        </span>
                        <span className="font-medium">{details.summary}</span>
                        {details.tags && (
                          <span className="text-xs text-gray-500">
                            {details.tags.join(', ')}
                          </span>
                        )}
                      </div>
                      {details.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {details.description}
                        </p>
                      )}
                      {details.parameters && details.parameters.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold mb-2">Parameters:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {details.parameters.map((param: any, idx: number) => (
                              <li key={idx}>
                                <code className="bg-gray-200 px-1 rounded">
                                  {param.name}
                                </code>{' '}
                                ({param.in}) - {param.description || param.schema?.type}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {details.requestBody && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold mb-2">Request Body:</p>
                          <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(
                              details.requestBody.content['application/json'].schema,
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      )}
                      {details.responses && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold mb-2">Responses:</p>
                          <ul className="space-y-2">
                            {Object.entries(details.responses).map(
                              ([status, response]: [string, any]) => (
                                <li key={status} className="text-sm">
                                  <span
                                    className={`inline-block w-16 text-center rounded px-2 py-1 mr-2 ${
                                      status.startsWith('2')
                                        ? 'bg-green-100 text-green-800'
                                        : status.startsWith('4')
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {status}
                                  </span>
                                  {response.description}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Schemas</h2>
            <div className="space-y-4">
              {Object.entries(spec.components.schemas).map(
                ([name, schema]: [string, any]) => (
                  <div key={name} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{name}</h3>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(schema, null, 2)}
                    </pre>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
