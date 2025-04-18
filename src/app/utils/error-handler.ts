/**
 * 格式化错误消息
 */
export function formatErrorMessage(error: Error): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return '发生未知错误';
}

/**
 * 记录服务器错误
 */
export function logServerError(source: string, error: Error) {
  console.error(`[${source}] 错误:`, error);

  // 提取和记录关键错误信息
  const errorInfo = {
    message: error.message || '未知错误',
    stack: error.stack,
    timestamp: new Date().toISOString()
  };

  console.error(`详细错误信息:`, JSON.stringify(errorInfo, null, 2));
}